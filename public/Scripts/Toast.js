function Toast(msg, status, title)
{
    let TOAST = document.createElement("div");

    TOAST.innerHTML = `
    <div class="toast border-${status} border-top" role="alert" aria-live="assertive" aria-atomic="true" data-autohide="false">
        <div class="toast-header">
            <img src="https://cdn.tolfix.com/images/TX-Small.png" width="28" class="rounded mr-2" alt="...">
            <strong class="mr-auto">${title}</strong>
            <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="toast-body">
            ${msg}
        </div>
    </div>`

    document.querySelector("#divLogs").appendChild(TOAST);
    
    $(document).ready(function(){
        $('.toast').toast('show');
    });
}