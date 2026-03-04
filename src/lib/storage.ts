import { supabase } from "@/lib/supabase";

const getPreferredStorageBuckets = () => {
  const preferred = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET as string | undefined;

  const buckets = [preferred, "media", "images", "uploads", "public"].filter(
    (value): value is string => Boolean(value && value.trim())
  );

  return Array.from(new Set(buckets));
};

const getProjectStorageBuckets = async () => {
  const { data, error } = await supabase.storage.listBuckets();

  if (error || !data) {
    return [];
  }

  return data
    .map((bucket) => bucket.name)
    .filter((value): value is string => Boolean(value && value.trim()));
};

type UploadResult = {
  bucket: string;
  publicUrl: string;
};

export async function uploadImageWithBucketFallback(filePath: string, file: File): Promise<UploadResult> {
  const preferredBuckets = getPreferredStorageBuckets();
  const projectBuckets = await getProjectStorageBuckets();
  const buckets = Array.from(new Set([...preferredBuckets, ...projectBuckets]));
  let lastError: Error | null = null;

  for (const bucket of buckets) {
    const { error } = await supabase.storage.from(bucket).upload(filePath, file);

    if (error) {
      const message = (error.message || "").toLowerCase();
      const isBucketMissing = message.includes("bucket not found");

      if (isBucketMissing) {
        lastError = error;
        continue;
      }

      throw error;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return { bucket, publicUrl: data.publicUrl };
  }

  if (lastError) {
    throw new Error(
      "Storage bucket not found. Create a public bucket (for example 'media') in Supabase Storage or set VITE_SUPABASE_STORAGE_BUCKET in .env.local."
    );
  }

  throw new Error(
    "No storage buckets available. Create a public bucket in Supabase Storage and retry."
  );
}
