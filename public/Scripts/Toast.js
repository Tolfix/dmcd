let toastCount = 0;

function Toast(msg, status, title)
{
    let TOAST = document.createElement("div");

    TOAST.innerHTML = `
    <div id="toast-${toastCount}" data-bs-autohide="false" class="toast border-${status} border-top" role="alert" aria-live="assertive" aria-atomic="true" data-autohide="false">
        <div class="toast-header">
            <img src="https://cdn.tolfix.com/images/TX-Small.png" width="28" class="rounded mr-2" alt="...">
            <strong class="me-auto">${title}</strong>
            <button id="toast-button-${toastCount}" type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${msg}
        </div>
    </div>`

    document.querySelector("#divLogs").appendChild(TOAST);
    
    $(document).ready(function(){
        $('.toast').toast('show');
    });
    let tempCount = toastCount;
    document.querySelector(`#toast-button-${toastCount}`).addEventListener("click", (msg) => {
        document.querySelector(`#toast-${tempCount}`).remove()
    })

    toastCount++
}