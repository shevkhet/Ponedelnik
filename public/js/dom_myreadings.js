
$("#addRow").on("click", function() {
        $(".bookAdd").hide();
    const inputRow = $(`
        <form class="bookForm" action="/add" method="post">
            <div class="grid-row title notside"> <input type="text" name="title" placeholder="Titre" > </div>
            <div class="grid-row author notside"> <input type="text" name="author" placeholder="Auteur"> </div>
            <div class="grid-row type notside"> <input type="text" name ="type" placeholder="Type d'ouvrage"> </div>
            <div class="grid-row edition notside"> <input type="text" name="editor" placeholder="Editeur"> </div>
            <div class="grid-row status notside"> <input type="text" name="status" placeholder="Progression"> </div>
            <div class="grid-row dateBegin notside"> <input type="text" name="dateBegin" placeholder="01/01/2025"> </div>
            <div class="grid-row dateEnd notside"> <input type="text" name="dateEnd"placeholder="31/12/2025"> </div>
            <div class="grid-header toDefine">A définir</div>
            <div class="grid-row final">
                <button id="saveRow" type="submit"><img id="iconRecord" src="/pictures/plus.svg" alt="Ajouter" class="pencilIcon"></button>
                <span id="iconLabel">Ajouter une nouvelle entrée final</span>
            </div>
        </form>
    `)
    .insertBefore(".bookAdd")           // Ajoute juste avant .bookAdd
    .find('input[name="title"]')        // Cherche le champ titre
    .trigger('focus');                  // ajoute autofocus
    
    $("#iconRecord")                          // modifie l'icône de sauvegarde
    .attr("src", "/pictures/record-circle.svg")
    .attr("alt", "Enregistrer");

    $("#iconLabel").html("Enregistrer une nouvelle entrée");
})

$(document).on("mouseenter", ".editButton img", function() {
    if (!$(this).hasClass("editing")) {
        $(this).attr("src", "/pictures/pencil-fill.svg"); // icône au survol
    }
});

$(document).on("mouseleave", ".editButton img", function() {
    if (!$(this).hasClass("editing")) {
        $(this).attr("src", "/pictures/pencil.svg"); // revient à l'icône crayon
    }
});

$(document).on("click", ".btn", function() {
    let rowToEdit = `${$(this).attr('id').slice(-1)}`
    const constance = $("#title"+rowToEdit);
    console.log(constance);
    const text = constance.text();
    constance.replaceWith(`<input type="text" id="title${rowToEdit}" class="grid-row notside editing" value="${constance.text().trim()}">`);
    
    $(`#iconPencil${rowToEdit}`)
        .attr("src", "/pictures/check-lg.svg")
        .addClass("editing")

});