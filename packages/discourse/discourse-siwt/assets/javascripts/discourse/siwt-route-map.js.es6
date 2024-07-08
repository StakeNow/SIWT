export default function () {
  this.route("siwt-auth", { path: "/discourse-siwt/auth" }, function () {
    this.route("index", { path: "/" });
  });
}
