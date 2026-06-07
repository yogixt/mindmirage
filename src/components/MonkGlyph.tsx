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
        src="/tejas/monk.jpg"
        alt="Tejas — the Karma Yogi"
        width={size}
        height={size}
        className={`select-none object-contain ${float ? "tejas-float" : ""}`}
        draggable={false}
      />
    );
  }
  return (
    <div
      className={`shrink-0 overflow-hidden rounded-full bg-[#FAF3E0] ring-1 ring-black/[0.05] ${
        float ? "tejas-float" : ""
      }`}
      style={{ width: size, height: size }}
    >
      <img
        src="/tejas/monk-small.png"
        alt=""
        className="h-full w-full scale-[1.12] object-cover object-[50%_18%] select-none"
        draggable={false}
      />
    </div>
  );
}
