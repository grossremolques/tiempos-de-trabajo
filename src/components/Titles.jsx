export function MainTitle({title, urlIcon}) {
    return (
        <h2 classtitle="text-center" style={{ fontSize: "30px" }}>
        <img
          src={urlIcon}
          alt={`icono de ${title}`}
          style={{ width: "40px", verticalAlign: "top", marginInlineEnd: '7px' }}
        />
        {title}
      </h2>
    )
}