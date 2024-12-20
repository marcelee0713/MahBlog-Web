import { FieldErrors, UseFormRegister } from "react-hook-form";
import { DeleteUserFormData } from "../../../ts/interface/settings-interfaces";
import { useState } from "react";
import { IoEyeOff, IoEye } from "react-icons/io5";

interface props {
  errors: FieldErrors<DeleteUserFormData>;
  register: UseFormRegister<DeleteUserFormData>;
}

export const DeleteUserInput: React.FC<props> = ({ errors, register }) => {
  return (
    <div className="relative flex flex-col gap-1 h-[50px] text-sm group">
      <input
        type="text"
        autoComplete="off"
        placeholder="sad to see you go..."
        className={`default-input-border  ${
          errors.confirmation && "!border-2 !border-red-400"
        } `}
        {...register("confirmation")}
      />

      {errors.confirmation && (
        <div className="flex gap-2 items-center font-normal text-red-400 px-3">
          <div>{errors.confirmation?.message}</div>
        </div>
      )}
    </div>
  );
};

export const PassInput: React.FC<props> = ({ errors, register }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative flex flex-col gap-1 h-[50px] text-sm group">
      <input
        id={"password"}
        type={visible ? "text" : "password"}
        autoComplete="off"
        className={`default-input-border  ${
          errors.password && "!border-2 !border-red-400"
        } `}
        {...register("password")}
      />

      {!visible && (
        <IoEyeOff
          className="absolute right-0 top-0 left-0 bottom-0 m-auto mr-2 text-secondary"
          size={25}
          onClick={() => setVisible(true)}
        />
      )}
      {visible && (
        <IoEye
          className="absolute right-0 top-0 left-0 bottom-0 m-auto mr-2 text-secondary"
          size={25}
          onClick={() => setVisible(false)}
        />
      )}

      <label
        htmlFor={"password"}
        className={`default-input-label ${
          errors.password && "!text-red-400 font-bold"
        }`}
      >
        {"Password"}
      </label>

      {errors.password && (
        <div className="flex gap-2 items-center font-normal text-red-400 px-3">
          <div>{errors.password.message}</div>
        </div>
      )}
    </div>
  );
};
