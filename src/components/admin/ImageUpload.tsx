import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadImage } from '@/src/lib/supabase';
import { Button } from '../ui/Button';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  bucket: 'portfolio' | 'posts' | 'brand';
  label?: string;
}

export function ImageUpload({ value, onChange, bucket, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { publicUrl, error } = await uploadImage(file, bucket);
      if (error) throw new Error(error);
      if (publicUrl) onChange(publicUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Falha ao subir imagem. Verifique se o bucket existe e as permissões RLS.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-bold uppercase text-zinc-500">{label}</label>}
      
      <div className="relative group aspect-video rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center overflow-hidden transition-colors hover:border-primary/50">
        {value ? (
          <>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                className="rounded-full"
                onClick={() => onChange('')}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <label className="cursor-pointer flex flex-col items-center gap-2 p-6">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-zinc-300 group-hover:text-primary transition-colors" />
            )}
            <span className="text-xs font-medium text-zinc-500">
              {uploading ? 'Subindo...' : 'Clique para subir uma imagem'}
            </span>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}
