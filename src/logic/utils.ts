export const delayed = <T>(callback: () => T, delay: number) =>
  new Promise<T>(resolve =>
    setTimeout(async () =>
        resolve(await callback()),
      delay));