import { ErrorMessage } from "@hookform/error-message";
import { FieldErrors } from "react-hook-form";


interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  errors: FieldErrors;
  children: React.ReactNode;
  variant?: "field" | "checkbox" | "group";
}
const FormField = ({
  label,
  name,
  required,
  errors,
  children,
  variant = "field",
}: FormFieldProps) => {
  const caption = (
    <>
      {label}{" "}
      {required && (
        <span aria-hidden="true" className="text-danger">
          *
        </span>
      )}
    </>
  );
  const error = (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => (
        <p
          id={name + "-error"}
          role="alert"
          className="text-danger text-sm"
        >
          {message}
        </p>
      )}
    />
  );
  if (variant === "group")
    return (
      <fieldset
        className="space-y-2"
        aria-describedby={errors[name] ? name + "-error" : undefined}
      >
        <legend className="text-sm font-medium">{caption}</legend>
        {children}
        {error}
      </fieldset>
    );
  return (
    <div className="space-y-2">
      {variant === "checkbox" ? (
        <label
          htmlFor={name}
          className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md py-2 text-sm font-medium"
        >
          {children}
          <span>{caption}</span>
        </label>
      ) : (
        <>
          <label htmlFor={name} className="block text-sm font-medium">{caption}</label>
          {children}
        </>
      )}
      {error}
    </div>
  );
};
export default FormField;
