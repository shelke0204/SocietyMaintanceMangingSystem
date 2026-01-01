function PasswordInput({ name, value, onChange, placeholder, required = true }) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative" data-name="password-input" data-file="components/PasswordInput.js">
      <input
        type={showPassword ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        className="input-field pr-12"
        placeholder={placeholder}
        required={required}
      />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setShowPassword(!showPassword);
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        <div className={`icon-${showPassword ? 'eye-off' : 'eye'} text-lg`}></div>
      </button>
    </div>
  );
}
