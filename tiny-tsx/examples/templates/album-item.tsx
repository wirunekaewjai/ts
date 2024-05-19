interface Album {
  title: string;
}

(album: Album) => (
  <div class="p-2">
    {album.title}
  </div>
);