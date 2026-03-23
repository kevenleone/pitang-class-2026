class FetcherError extends Error {
  public info: any;
  public status?: number;

  constructor(message: string) {
    super(message);
  }
}

export default FetcherError;
