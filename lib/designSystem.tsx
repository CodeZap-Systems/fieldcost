/**
 * FieldCost Design System
 * Consistent color palette, typography, and component styles
 */

export const DESIGN_SYSTEM = {
  colors: {
    primary: "indigo-600",
    primaryDark: "indigo-700",
    primaryLight: "indigo-100",
    secondary: "blue-700",
    background: "from-indigo-600 to-blue-700",
    backgroundLight: "gray-50",
    text: "gray-900",
    textLight: "gray-600",
    textMuted: "gray-500",
    border: "gray-300",
    borderLight: "gray-200",
    success: "blue-600",
    warning: "amber-600",
    error: "red-600",
  },
  fonts: {
    display: "font-bold",
    heading: "font-semibold",
    body: "font-normal",
  },
  spacing: {
    xs: "p-2",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  },
  shadows: {
    sm: "shadow",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  },
};

/**
 * Reusable button component
 */
export function PrimaryButton({ children, onClick, disabled = false, className = "" }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

/**
 * Reusable secondary button
 */
export function SecondaryButton({ children, onClick, disabled = false, className = "" }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

/**
 * Reusable card component
 */
export function Card({ children, className = "" }: any) {
  return (
    <div className={`bg-white rounded-lg shadow-xl p-8 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Reusable input field
 */
export function FormInput({ label, type = "text", placeholder, value, onChange, disabled = false }: any) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <input
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 disabled:bg-gray-100"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}

/**
 * Reusable alert component
 */
export function Alert({ type = "error", message }: any) {
  const bgColor = type === "error" ? "bg-red-100 border-red-400 text-red-700" : "bg-blue-100 border-blue-400 text-blue-700";
  return (
    <div className={`mb-4 p-3 ${bgColor} border rounded text-sm`}>
      {message}
    </div>
  );
}
