import React, { useEffect, useState } from "react";
import "./Dashboardd.css";
import axios from "axios";
import { Spin, Skeleton, Modal } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

// import hdrs from "../../assets/ChatGPT Image Apr 8, 2025, 11_50_23 PM.png";

const Dashboard = () => {
  const [responseData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [recipeData, setRecipeData] = useState({});

  const fetchApi = async () => {
    try {
      const response = await axios("https://dummyjson.com/recipes");
      if (response) {
        const recipes = response.data.recipes;
        const loadingImgs = {};
        recipes.forEach((val) => {
          loadingImgs[val.id] = true;
        });
        setImageLoading(loadingImgs);
        setResponseData(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const antIcon = (
    <LoadingOutlined style={{ fontSize: 40, color: "#ff914d" }} spin />
  );

  const handleModalOpen = (props) => {
    console.log(props, "ele");
    setRecipeData(props);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setRecipeData({});
    setModalOpen(false);
  };

  return (
    <>
      {loading ? (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff7f0",
          }}
        >
          <Spin size="large" indicator={antIcon} />
        </div>
      ) : (
        <div className="dashboard_container">
          <div className="hdr_card">
            <div>
              <h3>Plateful</h3>
            </div>
            <div className="hrd_txt">
              <h6>Recipes</h6>
              <h6>About</h6>
              <h6>Contact</h6>
            </div>
          </div>
          <div className="mid_content">
            <h1 className="mid_heading fade_up_slow">
              A plate full of flavors, stories and inspiration
            </h1>
          </div>

          <div className="items_card">
            {responseData?.recipes?.length > 0 &&
              responseData.recipes.map((ele, index) => (
                <div
                  key={ele.id}
                  className="inner_items fade_up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="recipe_img_wrapper">
                    {imageLoading[ele.id] ? (
                      <Skeleton.Image active className="recipe_skeleton_img" />
                    ) : null}
                    <img
                      src={ele.image}
                      alt={ele.name}
                      className="recipe_img"
                      style={{
                        display: imageLoading[ele.id] ? "none" : "block",
                      }}
                      onLoad={() =>
                        setImageLoading((prev) => ({
                          ...prev,
                          [ele.id]: false,
                        }))
                      }
                      onError={() =>
                        setImageLoading((prev) => ({
                          ...prev,
                          [ele.id]: false,
                        }))
                      }
                    />
                  </div>

                  <div className="recipe_content">
                    <h3>{ele.name}</h3>
                    <p className="tag">
                      {ele.cuisine} • {ele.mealType.join(", ")}
                    </p>
                    <div className="meta">
                      <span>
                        ⏱ {ele.prepTimeMinutes + ele.cookTimeMinutes} min
                      </span>
                      <span>🔥 {ele.caloriesPerServing} cal</span>
                    </div>
                    <div className="rating">
                      ⭐ {ele.rating} ({ele.reviewCount} reviews)
                    </div>
                    <button
                      className="view_btn"
                      onClick={() => handleModalOpen(ele)}
                    >
                      View Recipe
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <div className="antd_modal">
            <Modal
              open={modalOpen}
              footer={null}
              onCancel={handleModalClose}
              width={800}
              className="recipe_modal"
            >
              {recipeData && (
                <div className="recipe_modal_content">
                  <img
                    src={recipeData.image}
                    alt={recipeData.name}
                    className="modal_recipe_image"
                  />

                  <div className="modal_recipe_header">
                    <h2 className="modal_recipe_title">{recipeData.name}</h2>
                    <div className="modal_meta">
                      <span>
                        ⭐ {recipeData.rating} ({recipeData.reviewCount}{" "}
                        reviews)
                      </span>
                      <span>
                        ⏱{" "}
                        {recipeData.prepTimeMinutes +
                          recipeData.cookTimeMinutes}{" "}
                        min
                      </span>
                      <span>🔥 {recipeData.caloriesPerServing} cal</span>
                    </div>
                  </div>

                  <div className="modal_section">
                    <h3>Ingredients</h3>
                    <ul className="modal_list">
                      {recipeData?.ingredients?.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="modal_section">
                    <h3>Instructions</h3>
                    <ol className="modal_list">
                      {recipeData?.instructions?.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </Modal>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
