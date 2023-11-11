// Fonction de validation de la date
function verifDate(dateValue) {
    var dateNaissance = new Date(dateValue);
    var aujourdhui = new Date();

    if (dateNaissance > aujourdhui) {
        //alert('La date de naissance doit être dans le passé.');
        return false;
    } else {
        return true;
    }
};



// Code exécuté lorsque le document est prêt
$(document).ready(function(){
    $('#dateNaissance').on('change', function() {
        var dateIsValid = verifDate(this.value);
        if (!dateIsValid) {
            alert('La date de naissance doit être dans le passé.');
        }
    });

    // Gérer la validation des champs de saisie
    $('input').on('input', function() {
        if (this.validity.valid) {
            $(this).removeClass('invalid').addClass('valid');
        } else {
            $(this).removeClass('valid').addClass('invalid');
        }
    });
    // Fonction pour sauvegarder un contact dans le local storage
    function saveContact(contact) {
        localStorage.setItem(contact.num.toString(), JSON.stringify(contact));
    }

    // Fonction pour charger tous les contacts depuis le stockage local
    function loadContacts() {
        var contacts = [];
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (!isNaN(parseInt(key))) {
                contacts.push(JSON.parse(localStorage.getItem(key)));
            }
        }
        return contacts;
    }

   
    // Fonction pour construire le tableau de contacts en HTML
    function buildTable(contacts) {
        var tbody = $('#contacts tbody');
        tbody.empty();
        contacts.sort(function(a, b) {
            return a.num - b.num; // Trie les contacts par numéro dans l'ordre croissant
        });

        for (var i = 0; i < contacts.length; i++) {
            var contact = contacts[i];

            var row = '<tr>';

            row += '<td>' + contact.num + '</td>';
            row += '<td>' + contact.prenom + '</td>';
            row += '<td>' + contact.nom + '</td>';
            row += '<td>' + contact.telephone + '</td>';
            row += '<td>' + contact.email + '</td>';
            row += '<td>' + contact.dateNaissance + '</td>';
            row += '<td>' + contact.enfants + '</td>';
            row += '<td><img src="delete.jpg" id="deleteicon" alt=""></td>';
            row += '</tr>';

            tbody.append(row);
        }
    }

     // Construction initiale du tableau
    var contacts = loadContacts();
    buildTable(contacts);

    // Gérer la soumission du formulaire
    var i = contacts.length + 1;
    $('form').on('submit', function (e) {
        e.preventDefault();
    
        var nom = $('input[name="nom"]').val();
        var prenom = $('input[name="prenom"]').val();
        var telephone = $('input[name="telephone"]').val();
        var email = $('input[name="email"]');
        var dateNaissance = $('input[name="dateNaissance"]').val();
        var enfants = $('input[name="enfants"]').val();
    
        if (
            nom &&
            prenom &&
            telephone &&
            email.is(':valid') && // Vérifie la validité de l'e-mail
            verifDate(dateNaissance) &&
            enfants >= 0 &&
            enfants <= 5
        ) {
            var emailInput = email.val();
            var newContact = {
                nom: nom,
                prenom: prenom,
                telephone: telephone,
                email: emailInput,
                dateNaissance: dateNaissance,
                enfants: enfants,
                num: i,
            };
    
            saveContact(newContact);
            i++;
            $('form')[0].reset();
            buildTable(contacts);
        } else {
            alert('Veuillez remplir correctement le formulaire. l\'e-mail doit contenir :@enit.utm.tn et La date de naissance doit être dans le passé.');
        }
    });
    
    

    // Gérer la table de contacts initiale
    buildTable(contacts);


    // Fonction pour supprimer un contact
    function SupprimeContact(n) {
        var inputNumber = parseInt(n);
    
        if (isNaN(inputNumber)) {
            alert('S\'il vous plait, entrez un nombre valide.');
            return;
        }
    
        
        var contacts = loadContacts();
    
       
        var indexToDelete = -1;
        for (var i = 0; i < contacts.length; i++) {
            if (contacts[i].num === inputNumber) {
                indexToDelete = i;
                break;
            }
        }
    
        if (indexToDelete === -1) {
            alert('Contact avec numéro ' + inputNumber + 'n\'existe pas.');
            return;
        }
    
         // Supprimer la ligne du contact du tableau du DOM
        $('#contacts tbody tr:eq(' + indexToDelete + ')').remove();

        // Jouer le son de suppression
        $('#deleteSound')[0].play();

         // Supprimer la ligne du contact du local storage
        localStorage.removeItem(inputNumber.toString());
    }
     
    // Gérer le clic sur l'icône de la poubelle
    $('#trash-can img').on('click', function() {
        var inputNumber = $('#number').val();
        SupprimeContact(inputNumber);
    });

    // Fonction pour configurer le glisser-déposer
    function setupDragAndDrop() {

        // Rend chaque ligne du tableau draggable
        $('#contacts tbody tr').draggable({
            helper: 'clone',
            start: function (event, ui) {
                var index = $(this).index();
                ui.helper.data('index', index);
            }
        });

        // Fait de la poubelle une cible de dépôt
        $('#trash-can ').droppable({
            drop: function (event, ui) {
                var indexToDelete = ui.helper.data('index');
                var inputNumber = $('#contacts tbody tr:eq(' + indexToDelete + ')').find('td:eq(0)').text();
                SupprimeContact(inputNumber);
                $(ui.draggable).remove();
            
                indexToDelete--;
            },
            //tolerance: 100
            
            
            
        });
    }

     // Attache les gestionnaires de glisser-déposer
    setupDragAndDrop();
    
    
})