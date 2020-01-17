/* istanbul ignore file */
import { get, post } from "./interfaces/http";

get("https://jsonplaceholder.typicode.com/posts/101")
    .then(console.info)
    .catch(console.error);

const data = {
    title: "foo",
    body: "bar",
    userId: 101,
};

post("https://jsonplaceholder.typicode.com/posts", data)
    .then(console.info)
    .catch(console.error);
