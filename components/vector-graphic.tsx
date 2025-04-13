import { cn } from "@/lib/utils"

interface VectorGraphicProps {
  type: "wave" | "dots" | "circuit" | "grid" | "abstract"
  className?: string
  color?: string
  secondaryColor?: string
  width?: number
  height?: number
  opacity?: number
}

export default function VectorGraphic({
  type,
  className,
  color = "#06b6d4",
  secondaryColor = "#7c3aed",
  width = 200,
  height = 200,
  opacity = 0.2,
}: VectorGraphicProps) {
  const renderGraphic = () => {
    switch (type) {
      case "wave":
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 200 100"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("overflow-visible", className)}
          >
            <path
              d="M0,50 C30,20 70,80 100,50 C130,20 170,80 200,50"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeOpacity={opacity}
            />
            <path
              d="M0,70 C30,40 70,100 100,70 C130,40 170,100 200,70"
              fill="none"
              stroke={secondaryColor}
              strokeWidth="2"
              strokeOpacity={opacity}
            />
            <path
              d="M0,30 C30,0 70,60 100,30 C130,0 170,60 200,30"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeOpacity={opacity}
            />
          </svg>
        )
      case "dots":
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("overflow-visible", className)}
          >
            {Array.from({ length: 10 }).map((_, i) =>
              Array.from({ length: 10 }).map((_, j) => (
                <circle
                  key={`${i}-${j}`}
                  cx={i * 20 + 10}
                  cy={j * 20 + 10}
                  r={Math.random() * 3 + 1}
                  fill={(i + j) % 2 === 0 ? color : secondaryColor}
                  fillOpacity={opacity}
                />
              )),
            )}
          </svg>
        )
      case "circuit":
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("overflow-visible", className)}
          >
            <path
              d="M20,20 L100,20 L100,100 L180,100"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeOpacity={opacity}
            />
            <path
              d="M20,60 L60,60 L60,140 L140,140 L140,180"
              fill="none"
              stroke={secondaryColor}
              strokeWidth="2"
              strokeOpacity={opacity}
            />
            <path d="M20,100 L60,100 L60,20" fill="none" stroke={color} strokeWidth="2" strokeOpacity={opacity} />
            <path d="M100,60 L180,60" fill="none" stroke={secondaryColor} strokeWidth="2" strokeOpacity={opacity} />
            <path d="M140,20 L140,60" fill="none" stroke={color} strokeWidth="2" strokeOpacity={opacity} />
            <path
              d="M180,140 L100,140 L100,180"
              fill="none"
              stroke={secondaryColor}
              strokeWidth="2"
              strokeOpacity={opacity}
            />

            {/* Circuit nodes */}
            {[
              [20, 20],
              [100, 20],
              [140, 20],
              [180, 60],
              [180, 100],
              [180, 140],
              [140, 140],
              [100, 140],
              [100, 180],
              [60, 140],
              [20, 100],
              [20, 60],
              [60, 60],
              [60, 20],
              [100, 60],
              [100, 100],
              [140, 60],
            ].map(([cx, cy], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r="3"
                fill={i % 2 === 0 ? color : secondaryColor}
                fillOpacity={opacity * 1.5}
              />
            ))}
          </svg>
        )
      case "grid":
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("overflow-visible", className)}
          >
            {/* Horizontal lines */}
            {Array.from({ length: 11 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={i * 20}
                x2="200"
                y2={i * 20}
                stroke={i % 2 === 0 ? color : secondaryColor}
                strokeWidth="1"
                strokeOpacity={opacity}
              />
            ))}

            {/* Vertical lines */}
            {Array.from({ length: 11 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 20}
                y1="0"
                x2={i * 20}
                y2="200"
                stroke={i % 2 === 0 ? secondaryColor : color}
                strokeWidth="1"
                strokeOpacity={opacity}
              />
            ))}
          </svg>
        )
      case "abstract":
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("overflow-visible", className)}
          >
            <path
              d="M20,50 C60,0 140,0 180,50 C220,100 180,180 120,180 C60,180 20,120 20,50 Z"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeOpacity={opacity}
            />
            <path
              d="M40,70 C70,30 130,30 160,70 C190,110 160,170 110,170 C60,170 30,120 40,70 Z"
              fill="none"
              stroke={secondaryColor}
              strokeWidth="2"
              strokeOpacity={opacity}
            />
            <path
              d="M60,90 C80,60 120,60 140,90 C160,120 140,160 100,160 C60,160 40,120 60,90 Z"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeOpacity={opacity}
            />
            <circle cx="100" cy="100" r="10" fill={secondaryColor} fillOpacity={opacity} />
          </svg>
        )
      default:
        return null
    }
  }

  return renderGraphic()
}
