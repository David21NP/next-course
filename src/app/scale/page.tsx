import Presentation from "components/Presentation";
import MainImg from "public/scale.jpg";

export default function Scale() {
  return (
    <Presentation
      imgData={MainImg}
      alt="Scale img"
      title="Some long title about scaling"
    />
  );
}
