"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { metadata } from "./layout";

type Article = {
  content: string;
  content_title: string;
  content_category: {
    category_name: string;
  };
  meta_data: {
    ogp: {
      url: string;
    };
  };
  _published_at: string;
  poster: string;
  time_required: {
    single_line_1: string;
  };
};

export default function Home() {
  const [article, setArticle] = useState<Article>();
  const [publishedDate, setPublishedDate] = useState("");

  useEffect(() => {
    fetch(`https://cms-api.nilto.com/v1/contents/${1977407693}/`, {
      headers: {
        "X-NILTO-API-KEY": process.env.NEXT_PUBLIC_NILTO_API_KEY ?? "",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setArticle(() => data);
      });
  }, []);

  useEffect(() => {
    if (article) {
      const date = new Date(article._published_at);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      setPublishedDate(`${year}/${month}/${day}`);
    }
  }, [article]);

  return (
    <main>
      {article && (
        <div>
          <h2>{article.content_title}</h2>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="category-badge-wrapper">
              <span className="category-badge">
                {article.content_category.category_name}
              </span>
            </div>
          </div>
          <span>公開日：{publishedDate}</span>
          <p>投稿者：{article.poster}</p>
          <img className="thum" src={article.meta_data.ogp.url} alt="" />
          <p>
            この記事は約
            <span style={{ fontWeight: "bold" }}>
              {article.time_required.single_line_1}
            </span>
            で読めます
          </p>
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      )}
    </main>
  );
}
