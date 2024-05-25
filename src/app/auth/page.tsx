import { getServerSession } from "next-auth";
import SignIn from "../../components/SignIn";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth"

const SigninPage = async () => {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect("/dashboard");
    }
    return <SignIn />;
};

export default SigninPage;
