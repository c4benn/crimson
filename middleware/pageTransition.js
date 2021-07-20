import { timeout, updateUser } from "~/components/utils/main";

export default function ({ store, route, from }) {
  const app = store.$router.app;

  if (!store.state.beforeCreateCalled) {
    store.commit("UPDATE_", {
      path: "beforeCreateCalled",
      value: true,
    });

    const supabase = store.getters.supabase;

    supabase
      .from("users")
      .on("*", (p) => {
        const autoSignIn = async () => {
          const awaitingSignIn = store.getters.awaitingSignIn;
          const canSignInUSer =
            /update/i.test(p?.eventType) &&
            typeof awaitingSignIn == "object" &&
            awaitingSignIn !== null;

          if (canSignInUSer) {
            store.commit("UPDATE_", {
              value: { ...store.state.user, awaitingSignIn: null },
              name: "user",
            });

            app.supabase.auth.user() && (await supabase.auth.signOut());

            try {
              supabase.auth.signIn({ ...awaitingSignIn }).then((x) => {
                console.log(x);
              });
            } catch (e) {
              if (e) {
                return e;
              }
            }
          }
        };

        autoSignIn();
      })
      .subscribe();

    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(session, event);
      if (session) {
        const user = session.user;
        const sessionUser = await supabase
          .from("users")
          .select("*")
          .eq("uuid", `${user.id}`);
        const sessionName = sessionUser?.data?.[0]?.name;

        sessionName &&
          updateUser
            .call(app, {
              value: {
                meta: JSON.stringify(user),
                confirmed: !!user.confirmed_at,
              },
              id: user.id,
            })
            .then(async () => {
              const user = await supabase
                .from("users")
                .select("*")
                .eq("email", session.user.email);

              if (user.data?.[0]?.email) {
                store.commit("UPDATE_", {
                  name: "user",
                  value: {
                    ...store.state.user,
                    session,
                    ...user.data[0],
                  },
                });
              }
            });
      } else {
        store.commit("UPDATE_", {
          name: "user",
          value: { awaitingSignIn: null },
        });
      }
    });

    const signedInUser = supabase.auth.user();

    if (signedInUser) {
      const setUser = async () => {
        const user = await supabase
          .from("users")
          .select("*")
          .eq("email", signedInUser.email);

        if (user.data?.[0]?.email) {
          store.commit("UPDATE_", {
            name: "user",
            value: {
              awaitingSignIn: null,
              ...user.data[0],
              session: app.supabase.auth.session(),
            },
          });
        }
      };

      setUser();
    }
  }

  store.commit("UPDATE_", {
    path: "pageTransition",
    value: true,
  });

  if (/\/check-out/.test(from?.path || "")) {
    return store.commit("UPDATE_", {
      path: "pageTransition",
      value: "leaving-checkout",
    });
  }
  store.commit(
    "UPDATE_",

    {
      path: "pageTransition",
      value:
        route.path == "/"
          ? "going-home"
          : /\/check-out/.test(route.path)
          ? "checking-out"
          : "",
    }
  );

  app.$nextTick(() => {
    const routeLoaded = store.state?.fetched?.pages.includes(route.fullPath);

    if (process.client && routeLoaded) {
      const timeStamp = performance.now();

      timeout({
        timeStamp,
        callback: () => {
          store.commit("V_MODEL", {
            path: "loadingBar",
            value: false,
          });
        },
        delay: store.state.pageTransitionDuration,
        app,
      });
    }
  });

  // store.commit("UPDATE_", {
  //   path: "hideXOverflow",
  //   value: false,
  // });

  // store.commit("UPDATE_", {
  //   path: "hideXOverflowCalls",
  //   value: store.state.hideXOverflowCalls + 1,
  // });

  // if (store.state.hideXOverflowCalls > 1) {
  //   store.commit("UPDATE_", {
  //     path: "hideXOverflow",
  //     value: true,
  //   });

  //   timeout.call(
  //     {
  //       $store: store,
  //     },
  //     {
  //       callback: () => {
  //         store.commit("UPDATE_", {
  //           path: "hideXOverflow",
  //           value: false,
  //         });
  //       },
  //       delay: 100,
  //     }
  //   );
  // }
}
