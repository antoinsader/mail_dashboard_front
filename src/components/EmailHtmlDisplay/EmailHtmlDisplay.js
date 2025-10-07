export default function EmailHtmlDisplay({ html }) {
  return (
    <div
      className="field_value"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}
