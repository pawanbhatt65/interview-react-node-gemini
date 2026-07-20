import { Fragment } from "react/jsx-runtime";
import { RouterProvider } from "react-router";
import { router } from "./app.router";
import { AuthProvider } from "./features/auth/auth.context";
import { InterviewProvider } from "./features/interview/interview.context";

function App() {
  return (
    <Fragment>
      <AuthProvider>
        <InterviewProvider>
          <RouterProvider router={router} />
        </InterviewProvider>
      </AuthProvider>
    </Fragment>
  );
}

export default App;
