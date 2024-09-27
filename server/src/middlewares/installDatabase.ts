import { connect } from "mongoose";

const installMongodb = async () => {
  await connect(String(process.env.DATABASE_URL))
    .then(() => console.log("🚀 ~ Database connected successfully..."))
    .catch((e) => console.log("Error in database connection ", e));
};

export default installMongodb;
