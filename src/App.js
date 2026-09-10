import logo from "./logo.svg";
import "./App.css";
import { Button, Drawer } from "antd";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes";
import { Suspense, useState } from "react";
import { LoadingProvider } from "./contexts/loading.context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ModalEditProject from "./modules/Modals/Project/ModalEditProject";
import ModalEditTask from "./modules/Modals/Task/ModalEditTask";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<></>}>
        <QueryClientProvider client={queryClient}>
          <LoadingProvider>
            <ModalEditProject />
            <ModalEditTask />
            <Router />
          </LoadingProvider>
        </QueryClientProvider>
      </Suspense>
    </BrowserRouter>
  );
}
/// cái nút Drawer button nó hiện mà modal nó ko chạy ấy, sửa ntn
export default App;
