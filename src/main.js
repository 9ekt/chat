const inbox = document.querySelector("#inbox")
const inboxModal = document.querySelector("#inbox-modal")
const mdModalHeader = document.querySelector("#modal-md-header")
const mdButtonHeader = document.querySelector("#md-header-button")
const mdButtonAside = document.querySelector("#messages-md-button")
const mdModalAside = document.querySelector("#modal-md-aside")

inbox.addEventListener("click", () => {
  inboxModal.classList.toggle("header-content-inbox-modal-active")
})

document.addEventListener("click", (e) => {
  if (!inbox.contains(e.target) && !inboxModal.contains(e.target)) {
    inboxModal.classList.remove("header-content-inbox-modal-active")
  }

  if(!mdButtonHeader.contains(e.target) && !mdModalHeader.contains(e.target)) {
    mdModalHeader.classList.remove("modal-new-md-active")
  }

  if(!mdButtonAside.contains(e.target) && !mdModalAside.contains(e.target)) {
    mdModalAside.classList.remove("modal-new-md-active")
  }
})

mdButtonHeader.addEventListener("click", ()=> {
  mdModalHeader.classList.toggle("modal-new-md-active")
})

mdButtonAside.addEventListener("click", ()=> {
  mdModalAside.classList.toggle("modal-new-md-active")
})
