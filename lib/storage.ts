export type StorageProvider = "local" | "r2" | "minio";
export type UploadStatus = "ready" | "pending" | "error";

export type UploadResult = {
  provider: StorageProvider;
  storageKey: string;
  publicUrl?: string;
  status: UploadStatus;
  error?: string;
};

function getProvider(): StorageProvider {
  const raw = (process.env.NEXT_PUBLIC_STORAGE_PROVIDER || "local").toLowerCase();
  if (raw === "r2") return "r2";
  if (raw === "minio") return "minio";
  return "local";
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

export async function uploadFile(file: File): Promise<UploadResult> {
  const provider = getProvider();

  if (provider === "local") {
    const storageKey = `local/${uid("media")}`;
    if (file.type.startsWith("image/") && file.size <= 300 * 1024) {
      try {
        const publicUrl = await fileToDataUrl(file);
        return { provider, storageKey, publicUrl, status: "ready" };
      } catch (error) {
        return { provider, storageKey, status: "error", error: (error as Error).message };
      }
    }
    return { provider, storageKey, status: "ready" };
  }

  if (provider === "r2") {
    try {
      const res = await fetch("/api/storage/r2/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type || "application/octet-stream" }),
      });

      if (!res.ok) {
        const text = await res.text();
        return { provider, storageKey: `r2/${uid("media")}`, status: "error", error: text || "presign failed" };
      }

      const { uploadUrl, publicUrl, key } = await res.json();
      const put = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });

      if (!put.ok) {
        return { provider, storageKey: key, status: "error", error: `upload failed: ${put.status}` };
      }

      return { provider, storageKey: key, publicUrl, status: "ready" };
    } catch (error) {
      return { provider, storageKey: `r2/${uid("media")}`, status: "error", error: (error as Error).message };
    }
  }

  // MinIO 需要后端签名上传，先保留待上传状态。
  return { provider, storageKey: `${provider}/${uid("media")}`, status: "pending" };
}
