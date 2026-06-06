/* Sant AI — the Karma Yogi character.
   Large sizes show the full artwork; small sizes circle-crop the face
   (zoomed gently so the whole head stays in frame). */

export default function MonkGlyph({
  size = 36,
  float = false,
}: {
  size?: number;
  float?: boolean;
}) {
  if (size >= 120) {
    return (
      <img
        src="/sant-ai/monk.jpg"
        alt="Sant AI — the Karma Yogi"
        width={size}
        height={size}
        className={`select-none object-contain ${float ? "sant-float" : ""}`}
        draggable={false}
      />
    );
  }
  return (
    <div
      className={`shrink-0 overflow-hidden rounded-full bg-[#FAF3E0] ring-1 ring-black/[0.05] ${
        float ? "sant-float" : ""
      }`}
      style={{ width: size, height: size }}
    >
      <img
        src="/sant-ai/monk-small.png"
        alt=""
        className="h-full w-full scale-[1.12] object-cover object-[50%_18%] select-none"
        draggable={false}
      />
    </div>
  );
}
