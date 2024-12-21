import { useState, useEffect, useCallback } from "react";

const WCAGContrastChecker = () => {
  const [color1, setColor1] = useState("#ffffff");
  const [color2, setColor2] = useState("#000000");
  const [contrastRatio, setContrastRatio] = useState(0);
  const [results, setResults] = useState({});
  const [suggestedColors, setSuggestedColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);

  const hexToRgb = useCallback((hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }, []);

  const calculateRelativeLuminance = useCallback(({ r, g, b }) => {
    const [rNorm, gNorm, bNorm] = [r / 255, g / 255, b / 255].map((channel) =>
      channel <= 0.03928
        ? channel / 12.92
        : Math.pow((channel + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm;
  }, []);

  const calculateContrastRatio = useCallback(
    (hex1, hex2) => {
      const rgb1 = hexToRgb(hex1);
      const rgb2 = hexToRgb(hex2);

      const lum1 = calculateRelativeLuminance(rgb1);
      const lum2 = calculateRelativeLuminance(rgb2);

      return lum1 > lum2
        ? (lum1 + 0.05) / (lum2 + 0.05)
        : (lum2 + 0.05) / (lum1 + 0.05);
    },
    [hexToRgb, calculateRelativeLuminance]
  );

  const evaluateWCAG = useCallback((ratio) => {
    return {
      smallTextAA: ratio >= 4.5,
      smallTextAAA: ratio >= 7,
      largeTextAA: ratio >= 3,
      largeTextAAA: ratio >= 4.5,
    };
  }, []);

  const generateSuggestedColors = useCallback(() => {
    const suggestions = new Set();
    const baseRgb = hexToRgb(color1);

    for (let i = -20; i <= 20; i += 10) {
      for (let j = -20; j <= 20; j += 10) {
        for (let k = -20; k <= 20; k += 10) {
          const newR = Math.min(Math.max(baseRgb.r + i, 0), 255);
          const newG = Math.min(Math.max(baseRgb.g + j, 0), 255);
          const newB = Math.min(Math.max(baseRgb.b + k, 0), 255);

          const newColor = `#${newR.toString(16).padStart(2, "0")}${newG
            .toString(16)
            .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
          const contrast = calculateContrastRatio(newColor, color2);

          if (contrast >= 4.5) {
            suggestions.add(newColor);
            if (suggestions.size >= 10) break;
          }
        }
        if (suggestions.size >= 10) break;
      }
      if (suggestions.size >= 10) break;
    }

    setSuggestedColors(Array.from(suggestions));
  }, [color1, color2, hexToRgb, calculateContrastRatio]);

  const handleSuggestedColorClick = (color) => {
    if (selectedColor === color) {
      setSelectedColor(null);
      setContrastRatio(calculateContrastRatio(color1, color2).toFixed(2));
      setResults(evaluateWCAG(contrastRatio));
    } else {
      setSelectedColor(color);
      setContrastRatio(calculateContrastRatio(color, color2).toFixed(2));
      setResults(evaluateWCAG(calculateContrastRatio(color, color2)));
    }
  };

  useEffect(() => {
    if (!selectedColor) {
      const contrast = calculateContrastRatio(color1, color2).toFixed(2);
      setContrastRatio(contrast);
      setResults(evaluateWCAG(contrast));
    }
    generateSuggestedColors();
  }, [color1, color2, selectedColor, calculateContrastRatio, evaluateWCAG, generateSuggestedColors]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="p-6 bg-white shadow-lg rounded-lg w-[500px]">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          WCAG Contrast Checker
        </h1>
        <div className="flex gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Background Color (Color 1)
            </label>
            <input
              type="color"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="w-16 h-10 rounded-lg cursor-pointer"
            />
            <p className="text-sm text-gray-600 mt-2">{color1}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Text Color (Color 2)
            </label>
            <input
              type="color"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="w-16 h-10 rounded-lg cursor-pointer"
            />
            <p className="text-sm text-gray-600 mt-2">{color2}</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Contrast Ratio: {contrastRatio}
          </h2>
          <div
            className="p-4 border rounded-lg"
            style={{
              background: color1,
              color: color2,
            }}
          >
            Example Text
          </div>
          <ul className="mt-4">
            <li>
              <strong>Small Text (AA):</strong>{" "}
              {results.smallTextAA ? "✅" : "❌"}
            </li>
            <li>
              <strong>Small Text (AAA):</strong>{" "}
              {results.smallTextAAA ? "✅" : "❌"}
            </li>
            <li>
              <strong>Large Text (AA):</strong>{" "}
              {results.largeTextAA ? "✅" : "❌"}
            </li>
            <li>
              <strong>Large Text (AAA):</strong>{" "}
              {results.largeTextAAA ? "✅" : "❌"}
            </li>
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Suggested Background Colors
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {suggestedColors.map((color, index) => (
              <div
                key={index}
                className={`w-10 h-10 rounded-lg border cursor-pointer flex items-center justify-center ${
                  selectedColor === color ? "ring-2 ring-green-500" : ""
                }`}
                style={{ background: color }}
                onClick={() => handleSuggestedColorClick(color)}
              >
                {selectedColor === color && (
                  <span className="text-white font-bold">✔</span>
                )}
              </div>
            ))}
          </div>
          {selectedColor && (
            <p className="text-sm text-gray-800 mt-4">
              Selected Color: {selectedColor}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WCAGContrastChecker;
