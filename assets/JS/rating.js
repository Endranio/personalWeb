let cards = [
  {
    image: "profile.jpg",
    author: "Endra",
    response: "Keren bang",
    star: 3,
  },
  {
    image: "blue-hd-wallpaper-preview.jpg",
    author: "Boby",
    response:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi reprehenderit ipsam ut magni, libero odit, recusandae quidem harum architecto consequatur nihil eligendi iusto quae totam quam accusamus doloribus. Corporis, laboru Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi reprehenderit ipsam ut magni, libero odit, recusandae quidem harum architecto consequatur nihil eligendi iusto quae totam quam accusamus doloribus. Corporis, laborum?",
    star: 5,
  },
  {
    image: "profile.jpg",
    author: "Putra",
    response:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi reprehenderit ipsam ut magni, libero odit, recusandae quidem harum architecto consequatur nihil eligendi iusto quae totam quam accusamus doloribus. Corporis, laborum?",
    star: 4,
  },
  {
    image: "profile.jpg",
    author: "G",
    response: "Sugoi",
    star: 5,
  },
  {
    image: "blue-hd-wallpaper-preview.jpg",
    author: "Chris",
    response: "Mantap",
    star: 4,
  },
];

const cardContainer = document.getElementById("cardContainer");
const cardHTML = (daftarCard) => {return daftarCard
  .map(
    (card) => `
  <div class="d-flex justify-content-center my-3">
        <div class="card shadow col p-3" style="width: 18rem">
          <img src="assets/img/${card.image}" class="card-img-top" style="height:200px" alt="..." />
          <div class="card-body px-0">
            <div class="overflow-auto" style="height: 80px">
              <p>
                ${card.response}
              </p>
            </div>
            <div class="fw-bold text-end mt-3">
              <p>${card.author}</p>
              <p>${card.star}<i class="fas fa-star"></i></p>
            </div>
          </div>
        </div>
      </div>
`
  )
  .join("");
}

function showAll(){
    cardContainer.innerHTML = cardHTML(cards);
}

showAll()

function testimonialByStar (star){
    const filteredCard = cards.filter((card) => card.star === star)

    console.log(filteredCard)


    if(filteredCard.length === 0){
        return cardContainer.innerHTML = `<p>no testimonial</p>`
    }
    setTimeout(() => {
        cardContainer.innerHTML = cardHTML(filteredCard);
      }, 1000);

}
