"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type Values = {
  email: string;
  password: string;
};

export default function LoginAdmin() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues: { email: "", password: "" } });
  const router = useRouter();

  const handleLogin = async (data: Values) => {
    const resp = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: "/admin",
    });

    if (resp == null)
      throw new Error("Unexpected error: signIn returned undefined");

    if (resp.ok) {
      resp.url && router.push(resp.url);
    }

    if (resp === undefined) {
      setError("root", { message: "ocorreu um erro inesperado" });
    }

    switch (resp.error) {
      case "Invalid password":
        setError("password", { message: "Senha incorreta" });
        break;
      case "Invalid email":
        setError("email", { message: "E-mail não cadastrado" });
        break;
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <div className="px-5 py-7">
        <label className="block mb-5">
          <div className="font-semibold text-sm text-gray-600 pb-1 ">
            E-mail
          </div>
          <input
            id="email"
            {...register("email", { required: "obrigatório" })}
            type="text"
            className={[
              "border rounded-lg px-3 py-2 mt-1 text-sm w-full",
              errors.email ? "border-red-500" : "",
            ].join(" ")}
          />
          {errors.email && (
            <small className="text-red-500">{errors.email.message}</small>
          )}
        </label>
        <label className="block mb-5">
          <div className="font-semibold text-sm text-gray-600 pb-1 ">Senha</div>
          <input
            id="password"
            {...register("password", { required: "obrigatório" })}
            type="password"
            className={[
              "border rounded-lg px-3 py-2 mt-1 text-sm w-full",
              errors.password ? "border-red-500" : "",
            ].join(" ")}
          />
          {errors.password && (
            <small className="text-red-500">{errors.password.message}</small>
          )}
          {errors.root && (
            <small className="text-red-500">{errors.root.message}</small>
          )}
        </label>
        <button
          type="submit"
          className="transition duration-200 bg-green-500 hover:bg-green-600 focus:bg-green-600 focus:shadow-sm focus:ring-4 focus:ring-green-600 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-lg shadow-sm hover:shadow-md font-semibold text-center inline-block"
        >
          <span className="inline-block mr-2">Entrar</span>
        </button>
      </div>
    </form>
  );
}
