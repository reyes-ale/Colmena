/** Shared labeled text input used by Login / Registro forms. */
export function FormField({
  label,
  type = "text",
  placeholder,
  name,
  autoComplete,
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  placeholder: string;
  name: string;
  autoComplete?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}) {
  const id = `field-${name}`;
  return (
    <div className="flex w-full flex-col items-start gap-2" data-name="Input Field">
      <label htmlFor={id} className="font-normal leading-[1.4] text-[#1e1e1e] text-[16px] sm:text-[20px]">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        required={required}
        className="w-full rounded-[8px] border border-[#d9d9d9] bg-white px-4 py-3 text-[16px] text-[#1e1e1e] placeholder:text-[#b3b3b3] focus:outline-none focus:ring-2 focus:ring-[#0a142f]"
      />
    </div>
  );
}
