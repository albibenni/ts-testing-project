import fs from "fs";
import type http from "node:http";

export const requestHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>',
    );
    res.write("</html>");
    return res.end();
  }

  if (url === "/message" && method === "POST") {
    const body: any[] = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const [_, message] = parsedBody.split("=");
      fs.writeFile("./src/http-node/message.txt", message, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        /**
         * 302: Redirect
         */
        /**
         * could also use:
         * res.writeHead(302, { Location: "/" });
         */
        return res.end();
      });
    });
  }
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My Node App</title></head>");
  res.write("<body><h1>Hello, Node!</h1></body>");
  res.write("</head>");
  res.end();
};

export const requestUserHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => {
  const url = req.url;
  const method = req.method;

  if (url === "/users") {
    res.write("<html>");
    res.write("<ul><li>a</li><li>b</li></ul>");
    res.write("</html>");
    return res.end();
  }
  if (url === "/create-user" && method === "POST") {
    const body: any[] = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    res.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      res.setHeader("Location", "/");
      return res.end();
    });
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write(
    '<form action="/create-user" method="POST"><input type="text" name="username"></input><button onclick="submit">submit</button></form>',
  );
  res.write("</html>");
  res.end();
};
