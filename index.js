for (var i = 0; i < document.querySelectorAll(".navlink").length; i ++) {
    document.querySelectorAll(".navlink")[i].addEventListener("mouseover", function(){
        this.classList.add("pressed");
    })
    document.querySelectorAll(".navlink")[i].addEventListener("mouseleave", function(){
        this.classList.remove("pressed");
    })
}



