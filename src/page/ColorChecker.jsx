import { useCallback, useEffect, useState } from "react";
import PrimaryRoundedButtonWithIcon from "../components/Button";

const ColorChecker = () => {
  const [color1, setColor1] = useState("#ffffff");
  const [color2, setColor2] = useState("#000000");
  const [contrastRatio, setContrastRatio] = useState(0);
  const [results, setResults] = useState({});

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

  const evaluateWCAG = useCallback((ratio) => {
    const results = {
      smallTextAA: ratio >= 4.5,
      smallTextAAA: ratio >= 7,
      largeTextAA: ratio >= 3,
      largeTextAAA: ratio >= 4.5,
    };
    setResults(results);
  }, []);

  const calculateContrastRatio = useCallback(
    (hex1, hex2) => {
      const rgb1 = hexToRgb(hex1);
      const rgb2 = hexToRgb(hex2);

      const lum1 = calculateRelativeLuminance(rgb1);
      const lum2 = calculateRelativeLuminance(rgb2);

      const ratio =
        lum1 > lum2
          ? (lum1 + 0.05) / (lum2 + 0.05)
          : (lum2 + 0.05) / (lum1 + 0.05);

      setContrastRatio(ratio.toFixed(2));
      evaluateWCAG(ratio);
    },
    [hexToRgb, calculateRelativeLuminance, evaluateWCAG]
  );

  useEffect(() => {
    calculateContrastRatio(color1, color2);
  }, [color1, color2, calculateContrastRatio]);

  return (
    <div className="min-h-screen bg-gray-500 flex items-center justify-center">
      <div className="p-6 bg-[#230101] shadow-lg rounded-lg w-[500px] h-auto">
        <h1 className="text-xl font-bold text-gray-200 mb-4 text-center">
          Contrast Checker
        </h1>
        <div className="flex justify-around items-center gap-6 mb-6 border-b border-gray-700">
          {/* Color Inputs */}
          <div className="flex flex-col">
            <input
              type="color"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="w-24 h-16 rounded-lg cursor-pointer"
            />
            <p className="text-lg text-gray-300 font-semibold text-center">
              {color1}
            </p>
          </div>
          <div>
            <input
              type="color"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="w-24 h-16 rounded-lg cursor-pointer"
            />
            <p className="text-lg text-gray-300 font-semibold text-center">
              {color2}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold text-gray-200">
              {contrastRatio} : 1
            </h2>
            <h4 className="text-lg text-gray-200">Contrast Ratio (WCAG)</h4>
          </div>
          <div className="mt-5 flex justify-around">
            <div>
              <h3 className="text-gray-200 font-semibold">Small Text</h3>
              <ul className="text-gray-200">
                <li className="flex">
                  {results.smallTextAA ? "✅ " : "❌ "}
                  <strong>AA</strong>
                  <p className="ml-7">4.5:1</p>
                </li>
                <li className="flex">
                  {results.smallTextAAA ? "✅ " : "❌ "}
                  <strong>AAA</strong>
                  <p className="ml-5">7:1</p>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-200 font-semibold">Large Text</h3>
              <ul className="text-gray-200">
                <li className="flex">
                  {results.largeTextAA ? "✅ " : "❌ "}
                  <strong>AA</strong>
                  <p className="ml-7">3:1</p>
                </li>
                <li className="flex">
                  {results.largeTextAAA ? "✅ " : "❌ "}
                  <strong>AAA</strong>
                  <p className="ml-5">4.5:1</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center mt-10">
          <PrimaryRoundedButtonWithIcon />
        </div>
      </div>
    </div>
  );
};

export default ColorChecker;
