export const useRouter = () => ({
  refresh: () => {},
  push: (path: string) => history.pushState(null, "", path),
});
