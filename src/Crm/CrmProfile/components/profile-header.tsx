import React from "react";

interface ProfileHeaderImagesProps {
  portadaPreview: string | null;
  avatarPreview: string | null;
  onImageSelected: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "portada",
  ) => void;
}

export function ProfileHeaderImages({
  portadaPreview,
  avatarPreview,
  onImageSelected,
}: ProfileHeaderImagesProps) {
  return (
    <div className="w-full">
      {/* Portada */}
      <div className="relative w-full h-32 bg-slate-200 rounded-md border">
        {portadaPreview ? (
          <img
            src={portadaPreview}
            alt="Portada"
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-slate-500">
            Sin portada
          </div>
        )}
        <label className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white text-xs px-2 py-1 rounded cursor-pointer transition-colors">
          Cambiar Portada
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => onImageSelected(e, "portada")}
          />
        </label>
      </div>

      {/* Avatar */}
      <div className="flex justify-center -mt-12">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-[3px] border-white bg-slate-100 overflow-hidden shadow-sm">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-slate-500">
                Sin foto
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-slate-800 hover:bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded cursor-pointer shadow">
            Editar
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => onImageSelected(e, "avatar")}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
