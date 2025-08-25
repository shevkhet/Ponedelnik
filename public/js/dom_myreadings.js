
// add rows to record a new book in the library

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

// switch pencil icon when mouse passes on

$(document).on("mouseenter", ".editButton img", function() {
    if (!$(this).hasClass("editing")) {
        $(this).attr("src", "/pictures/pencil-fill.svg"); // icône au survol
    }
});

// return to initial pencil icons on mouse leave

$(document).on("mouseleave", ".editButton img", function() {
    if (!$(this).hasClass("editing")) {
        $(this).attr("src", "/pictures/pencil.svg"); // revient à l'icône crayon
    }
});


// gestion du clic sur le bouton crayon / check
$(document).on("click", ".btn", function() {
    const rowToEdit = this.id.replace(/\D/g, "");
    const $row = $(`#row${rowToEdit}`);
    const $btn = $(this);
    const $img = $btn.find(`#iconPencil${rowToEdit}`);

    // ---- CAS 1 : on clique sur le check (déjà en édition)
    if ($img.hasClass("editing")) {
        $row.submit(); // on envoie le formulaire
        return;
    }

    // ---- CAS 2 : on clique sur le crayon → on passe en édition
    $row.find(".grid-row").not(".editButton").each(function() {
        const $cell = $(this);
        const $cellId = $cell.attr("id");
        if (!$cellId) return;

        const value = $cell.text().trim();
        const fieldName = $cellId.replace(/\d+$/, "");

        $cell.replaceWith(`
            <input type="text" 
                id="${$cellId}" 
                class="grid-row notside editing" 
                name="${fieldName}" 
                value="${value}">
        `);
    });

    // Champ caché pour l'id
    if (!$row.find('input[name="id"]').length) {
        $row.append(`<input type="hidden" name="id" value="${rowToEdit}">`);
    }

    // Transformer le bouton en "check" (mais rester en type=button)
    $btn.attr("type", "button");
    $img.attr("src", "/pictures/check-lg.svg").addClass("editing");

    // Ajouter un bouton annuler
    const addIconCancel = $(`
        <button class="escape" id="cancel${rowToEdit}" type="button">
            <img id="iconCross${rowToEdit}" src="/pictures/x-circle.svg" class="editing">
        </button>
    `);
    $btn.after(addIconCancel);

    // hover sur la croix
    $(document).on("mouseenter", `#iconCross${rowToEdit}`, function() {
        $(this).attr("src", "/pictures/x-circle-fill.svg");
    });
    $(document).on("mouseleave", `#iconCross${rowToEdit}`, function() {
        $(this).attr("src", "/pictures/x-circle.svg");
    });
});