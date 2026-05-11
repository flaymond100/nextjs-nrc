import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function Scroll() {
  // when clicking a link, user will not scroll to the top of the page if the header is sticky.
  // their current scroll position will persist to the next page.
  // this useEffect is a workaround to 'fix' that behavior.

  const pathname = useLocation().pathname;
  useEffect(() => {
    window.scroll(0, 0);
  }, [pathname]);
  return <></>;
}
