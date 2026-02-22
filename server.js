const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  fs.readdir("./files", (err, fileNames) => {
    res.render("index", { fileNames });
  });
});

app.post("/create", (req, res) => {
  fs.writeFile(
    `./files/${req.body.title?.split(" ").join("_")}.txt`,
    req.body.details,
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error creating task");
      } else {
        res.redirect(`/`);
      }
    },
  );
});

app.get("/file/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading file");
    } else {
      res.render("file", { data, filename: req.params.filename });
    }
  });
});

app.get("/edit/:fileName", async (req, res) => {
  fs.readFile(`./files/${req.params.fileName}`, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading file");
    } else {
      res.render("edit", { fileData: data, fileName: req.params.fileName });
    }
  })
})



app.post("/update/:fileName", (req, res) => {
  fs.rename(`./files/${req.params.fileName}`, `./files/${req.body.title?.split(" ").join("_")}.txt`, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error updating file");
    } else {
      fs.writeFile(`./files/${req.body.title?.split(" ").join("_")}.txt`, req.body.details, (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error updating file");
        } else {
          res.redirect("/");
        }
      })
    }
  })
})


app.get("/delete/:fileName", (req, res) => {
  res.render("delete", { fileName: req.params.fileName });
})

app.post("/delete/:fileName", (req, res) => {
  fs.unlink(`./files/${req.params.fileName}`, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error deleting file");
    } else {
      res.redirect("/");
    }
  })
})

app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
