const { Router } = require("express");

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  res.render("index", { title: "GameWarehouse" });
});

module.exports = indexRouter;
