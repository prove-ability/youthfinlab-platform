export const useRouter = () => ({
  push: (path: string) => history.pushState(null, "", path),
});
