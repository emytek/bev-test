import AuthLayout from "../../../pages/AuthPages/AuthPageLayout";
import PageMeta from "../../common/PageMeta";
import RegisterUserForm from "./CreateUser";


export default function RegisterAccount() {
  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <RegisterUserForm />
      </AuthLayout>
    </>
  );
}
