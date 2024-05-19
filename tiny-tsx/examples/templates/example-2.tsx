interface Props {
  src: string;
  width: i32;
}

(props: Props) => (
  <img
    alt="this is image"
    src={props.src}
    width={props.width}
  />
);