import { useRef, useState } from "react";
import { Button } from "../button/Button";

interface ImageInputProps {
  value?: File | null;
  onChange?: (value: File | null) => void;
  error?: string;
}

export const ImageInput: React.FC<ImageInputProps> = ({
  value,
  onChange,
  error,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasError = Boolean(error);

  const handleFile = (file: File | null) => {
    if (!file) {
      onChange?.(null);
      return;
    }
    if (file.type.startsWith("image/")) {
      onChange?.(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0] ?? null);
  };

  const previewUrl = value ? URL.createObjectURL(value) : null;

  return (
    <div className="flex flex-col w-full gap-2">
      <label
        htmlFor="image-input"
        className="font-sans text-[18px] leading-normal text-primary-text"
      >
        Upload Dish Image
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors duration-200
          hover:border-primary hover:bg-input-field-bg/90
          ${isDragging ? "border-primary bg-input-field-bg/80" : ""}
          ${
            hasError
              ? "border-error-border bg-error"
              : "bg-input-field-bg border-input-border"
          }
        `}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="mx-auto max-h-64 rounded-lg object-contain"
          />
        ) : (
          <p className="text-body-text text-base">
            Drag & drop an image here, or click to select
          </p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {value && (
        <Button
          type="button"
          onClick={() => {
            onChange?.(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
          className="mt-4 w-full py-2 px-4 transition-colors duration-200"
        >
          Remove Image
        </Button>
      )}

      {hasError && (
        <p className="mt-1 font-sans text-[16px] leading-normal text-error-border">
          {error}
        </p>
      )}
    </div>
  );
};
