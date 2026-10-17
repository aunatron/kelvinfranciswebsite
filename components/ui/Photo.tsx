/**
 * One photograph, served the same way everywhere: an AVIF pair offered
 * first through <picture>, the JPEG as the universal fallback, explicit
 * width and height so the box is reserved before a byte arrives (CLS 0).
 * Files are produced by scripts/add-image.mjs, which strips metadata.
 */
export type PhotoSource = {
  src: string;
  avif?: string;
  avif_small?: string;
  alt: string;
  width: number;
  height: number;
};

export default function Photo({
  photo,
  sizes,
  eager = false,
  className,
}: {
  photo: PhotoSource;
  sizes: string;
  eager?: boolean;
  className?: string;
}) {
  const half = Math.round(photo.width / 2);
  const avifSet = [
    photo.avif_small ? `${photo.avif_small} ${half}w` : null,
    photo.avif ? `${photo.avif} ${photo.width}w` : null,
  ]
    .filter(Boolean)
    .join(", ");
  return (
    <picture className={className}>
      {avifSet ? <source type="image/avif" srcSet={avifSet} sizes={sizes} /> : null}
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    </picture>
  );
}
