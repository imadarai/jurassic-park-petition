console.log("Register.js is connected!");

console.log($(".close"),$(".overlay"), $(".overlay-text") );


$(".close").on("click", () => {
    $(".overlay")[0].style.display = "none";
    $(".overlay-text")[0].style.display = "none";
    $(".close")[0].style.display = "none";
});

$(document).on("click", () => {
    $(".overlay")[0].style.display = "none";
    $(".overlay-text")[0].style.display = "none";
    $(".close")[0].style.display = "none";
});
