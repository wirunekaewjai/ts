// AUTO GENERATED
use html_to_string_macro::html;

pub struct AlbumItemAlbum {
    title: String,
}

pub fn album_item(album: AlbumItemAlbum) -> String {
    return html!(
      <div class="p-2">
        {album.title}
      </div>
    );
}
