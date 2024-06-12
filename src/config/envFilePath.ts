const envFilePath =
  process.env.NODE_ENV === undefined
    ? '.env.local'
    : `.env.${process.env.NODE_ENV}`;

export default envFilePath;
