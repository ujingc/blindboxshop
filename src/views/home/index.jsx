import { ArrowRightOutlined } from '@ant-design/icons';
import { MessageDisplay } from '@/components/common';
import { ProductShowcaseGrid } from '@/components/product';
import { ProductGallery } from '@/components/product'
import { FEATURED_PRODUCTS, RECOMMENDED_PRODUCTS, SHOP } from '@/constants/routes';
import {
  useDocumentTitle, useFeaturedProducts, useRecommendedProducts, useScrollTop
} from '@/hooks';
import bannerImg from '@/images/banner-girl.png';
import React from 'react';
import { Link } from 'react-router-dom';
// Import your video files
import bannerVideoMp4 from '@/assets/videos/banner-video.mp4'; // Adjust path
import bannerVideoPoster from '@/assets/images/banner-rubbit.png'; // An image to show before video loads/if it fails


const Home = () => {
  useDocumentTitle('Cotta | Home');
  useScrollTop();

  const {
    featuredProducts,
    fetchFeaturedProducts,
    isLoading: isLoadingFeatured,
    error: errorFeatured
  } = useFeaturedProducts(6);
  const {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading: isLoadingRecommended,
    error: errorRecommended
  } = useRecommendedProducts(6);

  return (
    <main className="content">
      <div className="home">
        <div className="banner">
          <div className="banner-desc">
            <h1 className="text-thin">          
              <strong>Discover</strong>
              &nbsp;the Magic of the&nbsp;
              <strong>Holiday Season</strong>
            </h1>
            <p>
              Join our adorable friends on a heartwarming winter walk. Find your perfect festive collectible today!
            </p>
            <br />
            <Link to={SHOP} className="button">
              Shop Now &nbsp;
              <ArrowRightOutlined />
            </Link>
          </div>
          <div className="banner-video-container"> {/* Renamed for clarity */}
            <video autoPlay loop muted playsInline className="banner-video" poster={bannerVideoPoster}>
              <source src={bannerVideoMp4} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        <section className="section">
          <div className="section-header">
            <header>
              <h2>
                Explore the vault
              </h2>
              </header>    
          </div>
          <div>
            <ProductGallery 
              products={recommendedProducts}
              skeletonCount={6}/>
          </div>
        </section>
        <div className="display">
          <div className="display-header">
            <h1>Featured Products</h1>
            <Link to={FEATURED_PRODUCTS}>See All</Link>
          </div>
          {(errorFeatured && !isLoadingFeatured) ? (
            <MessageDisplay
              message={errorFeatured}
              action={fetchFeaturedProducts}
              buttonLabel="Try Again"
            />
          ) : (
            <ProductShowcaseGrid
              products={featuredProducts}
              skeletonCount={6}
            />
          )}
        </div>
        <div className="display">
          <div className="display-header">
            <h1>Recommended Products</h1>
            <Link to={RECOMMENDED_PRODUCTS}>See All</Link>
          </div>
          {(errorRecommended && !isLoadingRecommended) ? (
            <MessageDisplay
              message={errorRecommended}
              action={fetchRecommendedProducts}
              buttonLabel="Try Again"
            />
          ) : (
            <ProductShowcaseGrid
              products={recommendedProducts}
              skeletonCount={6}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
