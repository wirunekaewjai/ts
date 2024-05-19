// AUTO GENERATED
pub struct AlbumItemAlbum {
    title: String,
}

pub fn album_item(album: AlbumItemAlbum) -> String {
    return format!(r#"<div class="p-2">{}</div>"#, album.title);
}

/*
(
  <div class="p-2">
    {album.title}
  </div>
);
*/
